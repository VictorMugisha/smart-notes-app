"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchStore } from "@/lib/stores/search-store"
import { cn } from "@/lib/utils"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"

export function AdvancedSearch() {
  const { searchFilters, setSearchFilters, resetSearchFilters, isAdvancedSearchOpen, toggleAdvancedSearch } =
    useSearchStore()
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const hasActiveFilters =
    searchFilters.dateRange.start ||
    searchFilters.dateRange.end ||
    searchFilters.hasLabels !== null ||
    searchFilters.wordCount.min !== null ||
    searchFilters.wordCount.max !== null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAdvancedSearch}
          className={cn("gap-2", isAdvancedSearchOpen && "text-primary")}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {hasActiveFilters && <div className="w-2 h-2 bg-primary rounded-full" />}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetSearchFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {isAdvancedSearchOpen && (
        <div className="space-y-4 p-4 border rounded-lg bg-card/50">
          {/* Date Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="flex items-center gap-2">
              <Select
                value={searchFilters.dateRange.type}
                onValueChange={(value: "created" | "updated") =>
                  setSearchFilters({ dateRange: { ...searchFilters.dateRange, type: value } })
                }
              >
                <SelectTrigger className="w-[120px]" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Modified</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">between</span>
            </div>

            <div className="flex items-center gap-2">
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchFilters.dateRange.start ? format(searchFilters.dateRange.start, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchFilters.dateRange.start || undefined}
                    onSelect={(date) => {
                      setSearchFilters({ dateRange: { ...searchFilters.dateRange, start: date || null } })
                      setStartDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <span className="text-sm text-muted-foreground">and</span>

              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchFilters.dateRange.end ? format(searchFilters.dateRange.end, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchFilters.dateRange.end || undefined}
                    onSelect={(date) => {
                      setSearchFilters({ dateRange: { ...searchFilters.dateRange, end: date || null } })
                      setEndDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Labels Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Labels</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="any-labels"
                  checked={searchFilters.hasLabels === null}
                  onCheckedChange={(checked) => setSearchFilters({ hasLabels: checked ? null : true })}
                />
                <Label htmlFor="any-labels" className="text-sm">
                  Any
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-labels"
                  checked={searchFilters.hasLabels === true}
                  onCheckedChange={(checked) => setSearchFilters({ hasLabels: checked ? true : null })}
                />
                <Label htmlFor="has-labels" className="text-sm">
                  Has Labels
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-labels"
                  checked={searchFilters.hasLabels === false}
                  onCheckedChange={(checked) => setSearchFilters({ hasLabels: checked ? false : null })}
                />
                <Label htmlFor="no-labels" className="text-sm">
                  No Labels
                </Label>
              </div>
            </div>
          </div>

          {/* Word Count Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Word Count</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={searchFilters.wordCount.min || ""}
                onChange={(e) => {
                  const value = e.target.value ? Number.parseInt(e.target.value) : null
                  setSearchFilters({ wordCount: { ...searchFilters.wordCount, min: value } })
                }}
                className="w-20"
                size={10}
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={searchFilters.wordCount.max || ""}
                onChange={(e) => {
                  const value = e.target.value ? Number.parseInt(e.target.value) : null
                  setSearchFilters({ wordCount: { ...searchFilters.wordCount, max: value } })
                }}
                className="w-20"
                size={10}
              />
              <span className="text-sm text-muted-foreground">words</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
