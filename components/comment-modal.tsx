"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tokenAddress: string
  initialComment: string
  onSave: (address: string, comment: string) => void
}

export function CommentModal({ open, onOpenChange, tokenAddress, initialComment, onSave }: CommentModalProps) {
  const [comment, setComment] = useState(initialComment)

  useEffect(() => {
    setComment(initialComment)
  }, [initialComment, open]) // Обновляем комментарий при открытии или изменении initialComment

  const handleSave = () => {
    onSave(tokenAddress, comment)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-700 border-gray-600 text-white max-w-sm mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-white">Добавить комментарий</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-600"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="comment" className="text-sm text-gray-200">
            Ваш комментарий к этому источнику:
          </Label>
          <Input
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
            placeholder="Например: 'Разработчик из проекта X, очень надежный.'"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium">
            Сохранить
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium"
          >
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
