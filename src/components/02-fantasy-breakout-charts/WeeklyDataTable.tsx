'use client'
import React, { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Sticky } from '../Sticky';

interface PlayerPrediction {
  player: string;
  position: string;
  team: string;
  mlConfidence: number;
  sleeperScore: number;
  mlHit: boolean;
  sleeperHit: boolean;
  fpDelta: number;
}

interface WeeklyPrediction {
  week: number;
  totalPlayers: number;
  mlTop10Predictions: PlayerPrediction[];
  sleeperTop10Predictions: PlayerPrediction[];
  mlTop10Hits: number;
  mlTop3Hits: number;
  sleeperTop10Hits: number;
  sleeperTop3Hits: number;
  mlPrecisionTop10: number;
  sleeperPrecisionTop10: number;
}

function WeeklyDataTableContent({ weekData }: { weekData: WeeklyPrediction }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<PlayerPrediction>();

  const columns = React.useMemo(() => [
    columnHelper.accessor('player', {
      header: 'Player',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('position', {
      header: 'Pos',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('team', {
      header: 'Team',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('mlConfidence', {
      header: 'ML Conf',
      cell: info => (info.getValue() * 100).toFixed(1) + '%',
    }),
    columnHelper.accessor('sleeperScore', {
      header: 'Sleeper',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('mlHit', {
      header: 'ML Hit',
      cell: info => (
        <span style={{ color: info.getValue() ? '#16a34a' : '#dc2626' }}>
          {info.getValue() ? '✓' : '✗'}
        </span>
      ),
    }),
    columnHelper.accessor('sleeperHit', {
      header: 'Sleeper Hit',
      cell: info => (
        <span style={{ color: info.getValue() ? '#16a34a' : '#dc2626' }}>
          {info.getValue() ? '✓' : '✗'}
        </span>
      ),
    }),
    columnHelper.accessor('fpDelta', {
      header: 'FP Delta',
      cell: info => {
        const value = info.getValue();
        const color = value > 0 ? '#16a34a' : value < 0 ? '#dc2626' : 'inherit';
        return <span style={{ color }}>{value > 0 ? '+' : ''}{value.toFixed(1)}</span>;
      },
    }),
  ], [columnHelper]);

  const predictions = React.useMemo(() => {
    const merged: PlayerPrediction[] = [...weekData.mlTop10Predictions];
    const sleeperOnly = weekData.sleeperTop10Predictions.filter(
      s => !merged.some(p => p.player === s.player)
    );
    return [...merged, ...sleeperOnly];
  }, [weekData]);

  const table = useReactTable({
    data: predictions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left font-medium cursor-pointer transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-highlight)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="text-gray-400">
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="transition-colors"
              style={{ borderBottom: '1px solid var(--color-border)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-highlight)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WeeklyDataTable() {
  const [weeklyPredictions, setWeeklyPredictions] = useState<WeeklyPrediction[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number | undefined>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/02-fantasy-breakout-results.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        const predictions: WeeklyPrediction[] = jsonData.weeklyPredictions;
        setWeeklyPredictions(predictions);

        if (currentWeek === 0 && predictions.length > 0) {
          setCurrentWeek(predictions[predictions.length - 1].week);
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="my-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="my-4 text-center text-red-600">Error: {error}</div>;
  }

  const weekData = weeklyPredictions.find(w => w.week === currentWeek);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="week-selector" className="font-medium">
          Select Week for 2024:
        </label>
        <select
          id="week-selector"
          value={currentWeek}
          onChange={(e) => setCurrentWeek(Number(e.target.value))}
          className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border, #d1d5db)'
          }}
        >
          {weeklyPredictions.map(week => (
            <option style={{ backgroundColor: 'var(--color-bg)' }} key={week.week} value={week.week}>
              Week {week.week}
            </option>
          ))}
        </select>
      </div>

      {weekData && (
        <>
          <Sticky header={`Week ${weekData.week} Overview`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm opacity-70">Total Players</div>
                <div className="text-xl font-bold">{weekData.totalPlayers}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">ML Top 10 Hits</div>
                <div className="text-xl font-bold">{weekData.mlTop10Hits}/10</div>
                <div className="text-xs opacity-70">
                  {(weekData.mlPrecisionTop10 * 100).toFixed(0)}% accuracy
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">Sleeper Top 10 Hits</div>
                <div className="text-xl font-bold">{weekData.sleeperTop10Hits}/10</div>
                <div className="text-xs opacity-70">
                  {(weekData.sleeperPrecisionTop10 * 100).toFixed(0)}% accuracy
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">Top 3 Hits</div>
                <div className="text-xl font-bold">
                  ML: {weekData.mlTop3Hits} | Sleeper: {weekData.sleeperTop3Hits}
                </div>
              </div>
            </div>
          </Sticky>
          <WeeklyDataTableContent weekData={weekData} />
        </>
      )}
    </div>
  );
}