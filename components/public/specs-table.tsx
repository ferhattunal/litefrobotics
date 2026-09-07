"use client";

import { useMemo, useState } from "react";
import type { SpecPair } from "@/lib/specs-xml";

const PAGE_SIZE = 8;

export function SpecsTable({ rows }: { rows: SpecPair[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return rows;
    return rows.filter(
      (row) => row.label.toLocaleLowerCase("tr").includes(q) || row.value.toLocaleLowerCase("tr").includes(q),
    );
  }, [query, rows]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const slice = filtered.slice(start, start + PAGE_SIZE);
  const from = filtered.length ? start + 1 : 0;
  const to = Math.min(start + PAGE_SIZE, filtered.length);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Teknik özellikler</h2>
        <p className="text-sm text-stone-400">
          {from}-{to} / {filtered.length}
        </p>
      </div>
      <div className="relative mt-4">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400">⌕</span>
        <input
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pr-4 pl-9 text-sm outline-none focus:border-[var(--lf-625)]"
          placeholder="Özellik veya değer ara…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <table className="w-full table-fixed text-left text-sm">
          <tbody>
            {slice.map((row) => (
              <tr key={`${row.label}-${row.value}`} className="border-t border-stone-100 first:border-t-0">
                <th className="w-[42%] px-4 py-3.5 font-medium break-words text-stone-700 sm:px-5" style={{ background: "var(--lf-625-soft)" }}>
                  {row.label}
                </th>
                <td className="bg-white px-4 py-3.5 break-words text-stone-600 sm:px-5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!slice.length ? <p className="px-5 py-8 text-sm text-stone-400">Eşleşen özellik yok.</p> : null}
        <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm disabled:opacity-40"
            disabled={current <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            &lt; Önceki
          </button>
          <p className="text-sm text-stone-500">
            Sayfa {current} / {pageCount}
          </p>
          <button
            type="button"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm disabled:opacity-40"
            disabled={current >= pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            Sonraki &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
