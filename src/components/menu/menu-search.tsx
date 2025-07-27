"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MenuSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function MenuSearch({ onSearch, placeholder = "Search menu items..." }: MenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => setIsExpanded(true)}
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:border-primary transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 48 }}
            animate={{ opacity: 1, width: "100%" }}
            exit={{ opacity: 0, width: 48 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10 rounded-full border-gray-300 focus:border-primary"
                autoFocus
              />
              {searchQuery && (
                <Button
                  onClick={clearSearch}
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => {
                if (!searchQuery) {
                  setIsExpanded(false);
                }
              }}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}