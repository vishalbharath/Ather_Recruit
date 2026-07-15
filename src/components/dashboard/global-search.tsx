"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Search, FileText, User, Calendar, CornerDownLeft, Loader2 } from "lucide-react";
import { globalSearchAction, SearchResults, SearchResultItem } from "@/app/actions/search";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ jobs: [], candidates: [], interviews: [] });
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Ctrl+K / Cmd+K and Esc globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for custom trigger events (e.g. clicking the header search input)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-global-search", handleOpen);
    return () => window.removeEventListener("open-global-search", handleOpen);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults({ jobs: [], candidates: [], interviews: [] });
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Debounced search trigger
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ jobs: [], candidates: [], interviews: [] });
      setSearching(false);
      return;
    }

    setSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await globalSearchAction(query);
        setResults(res);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setSearching(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Flattened results for keyboard navigation
  const flatResults = useMemo(() => {
    return [...results.jobs, ...results.candidates, ...results.interviews];
  }, [results]);

  // Handle keyboard selections
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flatResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = flatResults[activeIndex];
      if (selected) {
        handleItemClick(selected);
      }
    }
  };

  const handleItemClick = (item: SearchResultItem) => {
    router.push(item.link);
    setIsOpen(false);
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getIcon = (type: "job" | "candidate" | "interview") => {
    switch (type) {
      case "job":
        return <FileText className="h-4 w-4 text-primary" />;
      case "candidate":
        return <User className="h-4 w-4 text-accent" />;
      case "interview":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm pt-20">
      {/* Click outside backdrop dismiss */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      {/* Command Palette Card */}
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl flex flex-col max-h-[60vh] overflow-hidden shadow-2xl relative">
        {/* Search Input */}
        <div className="flex h-12 items-center px-4 border-b border-border/40 gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search candidates, jobs, interviews..."
            className="flex-1 h-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-[10px] text-muted-foreground bg-zinc-900 border border-border px-1.5 py-0.5 rounded font-mono">
              ESC
            </span>
          )}
        </div>

        {/* Results Panel */}
        <div className="flex-1 overflow-y-auto p-2 min-h-[100px] max-h-[45vh] divide-y divide-border/10">
          {query.trim().length < 2 ? (
            <div className="py-12 text-center text-xs text-muted-foreground leading-relaxed">
              Type at least 2 characters to trigger workspace search...
            </div>
          ) : flatResults.length === 0 && !searching ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No matching records found for "{query}"
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Jobs section */}
              {results.jobs.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                    Job postings
                  </h4>
                  {results.jobs.map((item) => {
                    const idx = flatResults.findIndex((r) => r.id === item.id);
                    const isActive = idx === activeIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors gap-3",
                          isActive ? "bg-primary/10 text-foreground" : "hover:bg-zinc-900/40 text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {getIcon(item.type)}
                          <div className="truncate">
                            <p className="font-semibold text-foreground truncate">
                              {highlightText(item.title, query)}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        {isActive && <CornerDownLeft className="h-3 w-3 text-primary flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Candidates section */}
              {results.candidates.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                    Candidate Directory
                  </h4>
                  {results.candidates.map((item) => {
                    const idx = flatResults.findIndex((r) => r.id === item.id);
                    const isActive = idx === activeIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors gap-3",
                          isActive ? "bg-primary/10 text-foreground" : "hover:bg-zinc-900/40 text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {getIcon(item.type)}
                          <div className="truncate">
                            <p className="font-semibold text-foreground truncate">
                              {highlightText(item.title, query)}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        {isActive && <CornerDownLeft className="h-3 w-3 text-primary flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interviews section */}
              {results.interviews.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                    Scheduled Meetings
                  </h4>
                  {results.interviews.map((item) => {
                    const idx = flatResults.findIndex((r) => r.id === item.id);
                    const isActive = idx === activeIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors gap-3",
                          isActive ? "bg-primary/10 text-foreground" : "hover:bg-zinc-900/40 text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {getIcon(item.type)}
                          <div className="truncate">
                            <p className="font-semibold text-foreground truncate">
                              {highlightText(item.title, query)}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        {isActive && <CornerDownLeft className="h-3 w-3 text-primary flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
