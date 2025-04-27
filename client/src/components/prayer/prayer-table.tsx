import { format, parse } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface PrayerTimesDay {
  date: Date;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface PrayerTableProps {
  prayerTimes: PrayerTimesDay[];
}

export default function PrayerTable({ prayerTimes }: PrayerTableProps) {
  if (!prayerTimes || prayerTimes.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-primary text-white">
            <TableHead className="py-3 px-4 text-left">Date</TableHead>
            <TableHead className="py-3 px-4 text-center">Fajr</TableHead>
            <TableHead className="py-3 px-4 text-center">Sunrise</TableHead>
            <TableHead className="py-3 px-4 text-center">Dhuhr</TableHead>
            <TableHead className="py-3 px-4 text-center">Asr</TableHead>
            <TableHead className="py-3 px-4 text-center">Maghrib</TableHead>
            <TableHead className="py-3 px-4 text-center">Isha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, index) => (
            <TableRow key={index} className="border-b border-neutral-200">
              <TableCell className="py-3 px-4">
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="py-3 px-4 text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
              <TableCell className="py-3 px-4 text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
              <TableCell className="py-3 px-4 text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
              <TableCell className="py-3 px-4 text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
              <TableCell className="py-3 px-4 text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
              <TableCell className="py-3 px-4 text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary text-white">
          <TableHead className="py-3 px-4 text-left">Date</TableHead>
          <TableHead className="py-3 px-4 text-center">Fajr</TableHead>
          <TableHead className="py-3 px-4 text-center">Sunrise</TableHead>
          <TableHead className="py-3 px-4 text-center">Dhuhr</TableHead>
          <TableHead className="py-3 px-4 text-center">Asr</TableHead>
          <TableHead className="py-3 px-4 text-center">Maghrib</TableHead>
          <TableHead className="py-3 px-4 text-center">Isha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prayerTimes.map((day, index) => (
          <TableRow 
            key={index} 
            className={index < prayerTimes.length - 1 ? "border-b border-neutral-200 hover:bg-neutral-50" : "hover:bg-neutral-50"}
          >
            <TableCell className="py-3 px-4">
              <div className="font-medium">{format(day.date, 'EEEE')}</div>
              <div className="text-xs text-neutral-500">{format(day.date, 'dd MMMM yyyy')}</div>
            </TableCell>
            <TableCell className="py-3 px-4 text-center">{day.fajr}</TableCell>
            <TableCell className="py-3 px-4 text-center">{day.sunrise}</TableCell>
            <TableCell className="py-3 px-4 text-center">{day.dhuhr}</TableCell>
            <TableCell className="py-3 px-4 text-center">{day.asr}</TableCell>
            <TableCell className="py-3 px-4 text-center">{day.maghrib}</TableCell>
            <TableCell className="py-3 px-4 text-center">{day.isha}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
