"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterModal({ open, onOpenChange }: FilterModalProps) {
  const [migrationPercent, setMigrationPercent] = useState([29])
  const [maxDevbuy, setMaxDevbuy] = useState("5")
  const [tweetScoutMin, setTweetScoutMin] = useState("500")
  const [alphaGateMin, setAlphaGateMin] = useState("10")
  const [sources, setSources] = useState({
    pumpFun: true,
    bonk: true,
    jupiterStudio: true,
  })

  const handleReset = () => {
    setMigrationPercent([29])
    setMaxDevbuy("5")
    setTweetScoutMin("500")
    setAlphaGateMin("10")
    setSources({
      pumpFun: true,
      bonk: true,
      jupiterStudio: true,
    })
  }

  const handleApply = () => {
    // Handle apply logic here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Настройки фильтров</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-slate-400 hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Migration Percentage Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Минимальный % миграций</Label>
              <span className="text-sm text-slate-400">{migrationPercent[0]}%</span>
            </div>
            <Slider
              value={migrationPercent}
              onValueChange={setMigrationPercent}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Max Devbuy */}
          <div className="space-y-2">
            <Label className="text-sm">Максимальный Devbuy (SOL)</Label>
            <Input
              value={maxDevbuy}
              onChange={(e) => setMaxDevbuy(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="5"
            />
          </div>

          {/* TweetScout */}
          <div className="space-y-2">
            <Label className="text-sm">TweetScout смарты (мин.)</Label>
            <Input
              value={tweetScoutMin}
              onChange={(e) => setTweetScoutMin(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="500"
            />
          </div>

          {/* AlphaGate */}
          <div className="space-y-2">
            <Label className="text-sm">AlphaGate ключи (мин.)</Label>
            <Input
              value={alphaGateMin}
              onChange={(e) => setAlphaGateMin(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="10"
            />
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <Label className="text-sm">Источники делпулов</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pump-fun"
                  checked={sources.pumpFun}
                  onCheckedChange={(checked) => setSources((prev) => ({ ...prev, pumpFun: checked as boolean }))}
                />
                <Label htmlFor="pump-fun" className="text-sm">
                  Pump.fun
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bonk"
                  checked={sources.bonk}
                  onCheckedChange={(checked) => setSources((prev) => ({ ...prev, bonk: checked as boolean }))}
                />
                <Label htmlFor="bonk" className="text-sm">
                  BONK
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="jupiter-studio"
                  checked={sources.jupiterStudio}
                  onCheckedChange={(checked) => setSources((prev) => ({ ...prev, jupiterStudio: checked as boolean }))}
                />
                <Label htmlFor="jupiter-studio" className="text-sm">
                  Jupiter Studio
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleApply} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Применить
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
            >
              Сбросить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
