"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch" // Импортируем Switch

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  autoBuy: boolean
  setAutoBuy: (checked: boolean) => void
  openInAxiom: boolean
  setOpenInAxiom: (checked: boolean) => void
  openInTwitter: boolean
  setOpenInTwitter: (checked: boolean) => void
}

export function FilterModal({
  open,
  onOpenChange,
  autoBuy,
  setAutoBuy,
  openInAxiom,
  setOpenInAxiom,
  openInTwitter,
  setOpenInTwitter,
}: FilterModalProps) {
  const [migrationPercent, setMigrationPercent] = useState([29])
  const [maxDevbuy, setMaxDevbuy] = useState("5")
  const [tweetScoutMin, setTweetScoutMin] = useState("500")
  const [alphaGateMin, setAlphaGateMin] = useState("10")
  const [averageMcapMin, setAverageMcapMin] = useState("0")
  const [maxDevTokens, setMaxDevTokens] = useState("10") // Новое состояние для Макс Dev токенов
  const [sources, setSources] = useState({
    pumpFun: true,
    bonk: true,
    jupiterStudio: true,
  })

  const handleReset = () => {
    setMigrationPercent([30])
    setMaxDevbuy("5")
    setTweetScoutMin("1")
    setAlphaGateMin("1")
    setAverageMcapMin("0")
    setMaxDevTokens("10") // Сброс нового состояния
    setSources({
      pumpFun: true,
      bonk: true,
      jupiterStudio: true,
    })
    // Сброс состояний переключателей
    setAutoBuy(false)
    setOpenInAxiom(false)
    setOpenInTwitter(false)
  }

  const handleApply = () => {
    // Handle apply logic here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-700 border-gray-600 text-white max-w-md mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-white">Настройки фильтров</DialogTitle>
          
        </DialogHeader>

        <div className="space-y-6">
          {/* Переключатели, перенесенные из app/page.tsx */}
          <div className="space-y-4 border-b border-gray-600 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">Покупать автоматически</span>
              <Switch checked={autoBuy} onCheckedChange={setAutoBuy} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">Открывать в Axiom</span>
              <Switch checked={openInAxiom} onCheckedChange={setOpenInAxiom} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">Открывать Twitter</span>
              <Switch checked={openInTwitter} onCheckedChange={setOpenInTwitter} />
            </div>
          </div>

          {/* Migration Percentage Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-200">Минимальный % миграций</Label>
              <span className="text-sm text-gray-300">{migrationPercent[0]}%</span>
            </div>
            <Slider
              value={migrationPercent}
              onValueChange={setMigrationPercent}
              max={100}
              min={0}
              step={1}
              className="w-full [&>span:first-child]:bg-gray-500 [&>span:last-child]:bg-green-500 [&_[role=slider]]:border-green-500 [&_[role=slider]]:bg-green-500"
            />
          </div>

          {/* Max Devbuy */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-200">Максимальный Devbuy (SOL)</Label>
            <Input
              value={maxDevbuy}
              onChange={(e) => setMaxDevbuy(e.target.value)}
              className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
              placeholder="5"
            />
          </div>

          {/* Max Dev Tokens (New Field) */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-200">Макс Dev токенов</Label>
            <Input
              value={maxDevTokens}
              onChange={(e) => setMaxDevTokens(e.target.value)}
              className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
              placeholder="10"
            />
          </div>

          {/* Average Mcap */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-200">Средний Mcap (мин.)</Label>
            <Input
              value={averageMcapMin}
              onChange={(e) => setAverageMcapMin(e.target.value)}
              className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
              placeholder="0"
            />
          </div>

          {/* TweetScout */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-200">TweetScout смарты (мин.)</Label>
            <Input
              value={tweetScoutMin}
              onChange={(e) => setTweetScoutMin(e.target.value)}
              className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
              placeholder="500"
            />
          </div>

          {/* AlphaGate */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-200">AlphaGate ключи (мин.)</Label>
            <Input
              value={alphaGateMin}
              onChange={(e) => setAlphaGateMin(e.target.value)}
              className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
              placeholder="10"
            />
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-200">Источники делпулов</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pump-fun"
                  checked={sources.pumpFun}
                  onCheckedChange={(checked) => setSources((prev) => ({ ...prev, pumpFun: checked as boolean }))}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <Label htmlFor="pump-fun" className="text-sm text-gray-200">
                  Pump.fun
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bonk"
                  checked={sources.bonk}
                  onCheckedChange={(checked) => setSources((prev) => ({ ...prev, bonk: checked as boolean }))}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <Label htmlFor="bonk" className="text-sm text-gray-200">
                  BONK
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="jupiter-studio"
                  checked={sources.jupiterStudio}
                  onCheckedChange={(checked) => setSources((prev) => ({ ...prev, jupiterStudio: checked as boolean }))}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <Label htmlFor="jupiter-studio" className="text-sm text-gray-200">
                  Jupiter Studio
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleApply} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium">
              Применить
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium"
            >
              Сбросить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
