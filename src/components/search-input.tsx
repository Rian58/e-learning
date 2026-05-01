"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce"; // Will create this

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder = "Cari..." }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("query")?.toString() || "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400); // 400ms debounce
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery) {
        params.set("query", debouncedQuery);
      } else {
        params.delete("query");
      }
      
      const newUrl = `${pathname}?${params.toString()}`;
      if (searchParams.toString() !== params.toString()) {
        router.replace(newUrl);
      }
    });
  }, [debouncedQuery, pathname, router, searchParams]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="relative max-w-sm w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-9 neo-input border-2 bg-background font-medium h-10 w-full"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
