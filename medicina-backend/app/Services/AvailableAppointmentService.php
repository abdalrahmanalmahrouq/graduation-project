<?php

namespace App\Services;

use App\Models\AvailableAppointment;
use App\Models\ClinicDoctor;
use Carbon\Carbon;

class AvailableAppointmentService
{
    /**
     * Generate slots for a given clinic doctor between two dates (inclusive).
     * Returns summary array with counts and created slots.
     * For the moment, ignore this function.
     */
    public static function generateForRange(ClinicDoctor $clinicDoctor, Carbon $startDate, Carbon $endDate)
    {
        $cursor = $startDate->copy();
        $summary = [
            'created' => 0,
            'slots' => [],
        ];

        while ($cursor->lte($endDate)) {
            $res = self::generateForDate($clinicDoctor, $cursor);
            $summary['created'] += $res['created'] ?? 0;
            if (!empty($res['slots'])) {
                $summary['slots'] = array_merge($summary['slots'], $res['slots']);
            }
            $cursor->addDay();
        }

        return $summary;
    }

    /**
     * Generate slots for a single date. Returns ['created'=>int,'slots'=>array]
     * For the moment, ignore this function.
     */
    public static function generateForDate(ClinicDoctor $clinicDoctor, Carbon $date)
    {
        $schedule = $clinicDoctor->weekly_schedule;

        if (empty($schedule) || !is_array($schedule)) {
            return ['created' => 0, 'slots' => []];
        }

        $weekdayShort = strtolower($date->format('D'));
        $weekdayFull = strtolower($date->format('l'));

        $map = [
            'mon' => ['mon', 'monday'],
            'tue' => ['tue', 'tues', 'tuesday'],
            'wed' => ['wed', 'wednesday'],
            'thu' => ['thu', 'thurs', 'thursday'],
            'fri' => ['fri', 'friday'],
            'sat' => ['sat', 'saturday'],
            'sun' => ['sun', 'sunday'],
        ];

        $dayKey = null;
        foreach ($map as $k => $variants) {
            if (in_array($weekdayShort, $variants) || in_array($weekdayFull, $variants)) {
                $dayKey = $k;
                break;
            }
        }

        if ($dayKey === null) {
            foreach ($schedule as $k => $v) {
                if (strtolower($k) === $weekdayShort || strtolower($k) === $weekdayFull) {
                    $dayKey = $k;
                    break;
                }
            }
        }

        if ($dayKey === null || !isset($schedule[$dayKey]) || $schedule[$dayKey] === null) {
            return ['created' => 0, 'slots' => []];
        }

        $daySchedule = $schedule[$dayKey];
        if (empty($daySchedule) || !is_array($daySchedule) || empty($daySchedule['start_time']) || empty($daySchedule['end_time'])) {
            return ['created' => 0, 'slots' => []];
        }

        $start = Carbon::createFromFormat('H:i', $daySchedule['start_time']);
        $end = Carbon::createFromFormat('H:i', $daySchedule['end_time']);

        $breakStart = null;
        $breakEnd = null;
        if (!empty($daySchedule['break_start']) && !empty($daySchedule['break_end'])) {
            $breakStart = Carbon::createFromFormat('H:i', $daySchedule['break_start']);
            $breakEnd = Carbon::createFromFormat('H:i', $daySchedule['break_end']);
        }

        $durationMinutes = optional($clinicDoctor->doctor)->consultation_duration ?: 30;

        $slotsCreated = 0;
        $slots = [];

        $cursor = $start->copy();
        while ($cursor->lte($end->subSeconds(1))) {
            $slotStart = $cursor->copy();
            $slotEnd = $slotStart->copy()->addMinutes($durationMinutes);

            if ($slotEnd->gt($end)) {
                break;
            }

            $overlapsBreak = false;
            if ($breakStart && $breakEnd) {
                if ($slotStart->lt($breakEnd) && $slotEnd->gt($breakStart)) {
                    $overlapsBreak = true;
                }
            }

            if (!$overlapsBreak) {
                $starting_time = $slotStart->format('H:i:s');

                $existing = AvailableAppointment::where('clinic_doctor_id', $clinicDoctor->id)
                    ->where('day', $date->format('Y-m-d'))
                    ->where('starting_time', $starting_time)
                    ->first();

                if (!$existing) {
                    AvailableAppointment::create([
                        'clinic_doctor_id' => $clinicDoctor->id,
                        'day' => $date->format('Y-m-d'),
                            'starting_time' => $starting_time,
                            'ending_time' => $slotEnd->format('H:i:s'),
                    ]);
                    $slotsCreated++;
                    $slots[] = $starting_time;
                }
            }

            $cursor->addMinutes($durationMinutes);
        }

        return ['created' => $slotsCreated, 'slots' => $slots];
    }

    /**
     * Generate template slots (weekday-based) from the ClinicDoctor weekly_schedule.
     * This creates one row per weekday+starting_time (e.g. 'mon', '09:00:00') and is
     * intended to represent available times per weekday regardless of date.
     *
     * It will not duplicate existing template rows (checks clinic_doctor_id, day, starting_time).
     */
    public static function generateFromWeeklySchedule(ClinicDoctor $clinicDoctor)
    {
        $schedule = $clinicDoctor->weekly_schedule;
        if (empty($schedule) || !is_array($schedule)) {
            return ['created' => 0, 'slots' => []];
        }

        // Normalized weekday keys we support and their variants
        $map = [
            'sunday' => ['sun', 'sunday'],
            'monday' => ['mon', 'monday'],
            'tuesday' => ['tue', 'tues', 'tuesday'],
            'wednesday' => ['wed', 'wednesday'],
            'thursday' => ['thu', 'thurs', 'thursday'],
            'friday' => ['fri', 'friday'],
            'saturday' => ['sat', 'saturday'],
        ];

    $created = 0;
    $createdSlots = [];

        foreach ($map as $dayKey => $variants) {
            // find schedule entry for this weekday (case-insensitive)
            $entry = null;
            foreach ($variants as $v) {
                if (array_key_exists($v, $schedule)) {
                    $entry = $schedule[$v];
                    break;
                }
            }

            // also try matching original keys ignoring case
            if ($entry === null) {
                foreach ($schedule as $k => $v) {
                    if (strtolower($k) === $dayKey) {
                        $entry = $v;
                        break;
                    }
                }
            }

            if (empty($entry) || $entry === null) {
                continue;
            }

            // Support two shapes for an entry:
            // 1) object with start_time/end_time (and optional break_start/break_end)
            // 2) array of ranges like ['09:00-12:00','13:00-17:00']

            $ranges = [];

            if (is_array($entry) && array_key_exists('start_time', $entry) && array_key_exists('end_time', $entry)) {
                // single block
                $ranges[] = [
                    'start_time' => $entry['start_time'],
                    'end_time' => $entry['end_time'],
                    'break_start' => $entry['break_start'] ?? null,
                    'break_end' => $entry['break_end'] ?? null,
                ];
            } elseif (is_array($entry)) {
                // maybe an array of strings representing ranges
                foreach ($entry as $item) {
                    if (!is_string($item)) continue;
                    if (strpos($item, '-') !== false) {
                        [$s, $e] = explode('-', $item, 2);
                        $ranges[] = ['start_time' => trim($s), 'end_time' => trim($e), 'break_start' => null, 'break_end' => null];
                    }
                }
            }

            if (empty($ranges)) {
                continue;
            }

            $duration = optional($clinicDoctor->doctor)->consultation_duration ?: 30;

            foreach ($ranges as $r) {
                try {
                    $start = Carbon::createFromFormat('H:i', $r['start_time']);
                    $end = Carbon::createFromFormat('H:i', $r['end_time']);
                } catch (\Exception $e) {
                    // skip invalid range
                    continue;
                }

                $breakStart = null;
                $breakEnd = null;
                if (!empty($r['break_start']) && !empty($r['break_end'])) {
                    try {
                        $breakStart = Carbon::createFromFormat('H:i', $r['break_start']);
                        $breakEnd = Carbon::createFromFormat('H:i', $r['break_end']);
                    } catch (\Exception $e) {
                        // ignore invalid break times
                    }
                }

                $cursor = $start->copy();
                while ($cursor->lte($end->subSeconds(1))) {
                    $slotStart = $cursor->copy();
                    $slotEnd = $slotStart->copy()->addMinutes($duration);
                    if ($slotEnd->gt($end)) {
                        break;
                    }

                    $overlapsBreak = false;
                    if ($breakStart && $breakEnd) {
                        if ($slotStart->lt($breakEnd) && $slotEnd->gt($breakStart)) {
                            $overlapsBreak = true;
                        }
                    }

                    if (!$overlapsBreak) {
                        $starting_time = $slotStart->format('H:i:s');

                        $exists = AvailableAppointment::where('clinic_doctor_id', $clinicDoctor->id)
                            ->where('day', $dayKey)
                            ->where('starting_time', $starting_time)
                            ->exists();

                        if (!$exists) {
                            AvailableAppointment::create([
                                'clinic_doctor_id' => $clinicDoctor->id,
                                'day' => $dayKey,
                                    'starting_time' => $starting_time,
                                    'ending_time' => $slotEnd->format('H:i:s'),
                            ]);
                            $created++;
                            $createdSlots[] = [$dayKey, $starting_time];
                        }
                    }

                    $cursor->addMinutes($duration);
                }
            }
        }

        return ['created' => $created, 'slots' => $createdSlots];
    }
}
