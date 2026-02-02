import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Slider } from "../ui/slider"

const DPI_OPTIONS = [100, 200, 300, 400, 500, 600]

function normalizeRangeInput(value: string) {
  return value.replace(/\s+/g, "")
}

function hasMultiplePages(rangeInput: string) {
  if (!rangeInput) return false
  return /[,-]/.test(rangeInput)
}

function ConvertForm() {
  const [pageMode, setPageMode] = useState<"all" | "range">("all")
  const [rangeInput, setRangeInput] = useState("")
  const [format, setFormat] = useState<"png" | "jpeg">("png")
  const [quality, setQuality] = useState(90)
  const [dpi, setDpi] = useState(200)
  const [exportMode, setExportMode] = useState<"single" | "zip">("single")

  const normalizedRange = useMemo(() => normalizeRangeInput(rangeInput), [rangeInput])
  const isMultipleRange = pageMode === "range" && hasMultiplePages(normalizedRange)
  const exportLockedToZip = isMultipleRange
  const showQuality = format === "jpeg"

  useEffect(() => {
    if (exportLockedToZip) {
      setExportMode("zip")
    }
  }, [exportLockedToZip])

  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/60 shadow-2xl">
      <CardHeader className="border-b border-slate-800 pb-4">
        <CardTitle className="text-sm font-semibold">변환 옵션</CardTitle>
        <CardDescription className="text-xs text-slate-400">
          PDF를 이미지로 변환하기 전에 필요한 설정을 선택하세요.
        </CardDescription>
        <CardAction>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
            로컬 처리
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-5 md:grid-cols-2">
        <fieldset className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:col-span-2">
          <legend className="px-2 text-xs font-semibold text-slate-200">페이지 선택</legend>
          <div className="mt-2 grid gap-4">
            <RadioGroup
              value={pageMode}
              onValueChange={(value) => setPageMode(value as "all" | "range")}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="page-all" />
                <Label htmlFor="page-all" className="text-xs text-slate-200">
                  전체 페이지
                </Label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <RadioGroupItem value="range" id="page-range" />
                <Label htmlFor="page-range" className="text-xs text-slate-200">
                  범위 지정
                </Label>
                <Input
                  id="page-range-input"
                  aria-label="페이지 범위 입력"
                  className={`h-9 min-w-[200px] flex-1 border-slate-800 bg-slate-950/70 text-xs text-slate-200 placeholder:text-slate-600 ${
                    pageMode === "range" ? "" : "hidden"
                  }`}
                  placeholder="예: 1-5, 8, 10-12"
                  value={rangeInput}
                  onChange={(event) => setRangeInput(event.target.value)}
                  disabled={pageMode !== "range"}
                />
              </div>
            </RadioGroup>

            <p className="text-[11px] text-slate-500">
              여러 페이지를 지정할 수 있습니다. 예: 1-5, 8, 10-12
            </p>
            <p className="text-xs text-rose-400">에러: 페이지 범위를 확인해주세요.</p>
          </div>
        </fieldset>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4">
          <p className="text-xs text-slate-400">이미지 포맷</p>
          <RadioGroup
            value={format}
            onValueChange={(value) => setFormat(value as "png" | "jpeg")}
            className="mt-3 grid gap-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="png" id="format-png" />
              <Label htmlFor="format-png" className="text-xs text-slate-200">
                PNG (무손실)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="jpeg" id="format-jpeg" />
              <Label htmlFor="format-jpeg" className="text-xs text-slate-200">
                JPEG (용량 절약)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">품질 (JPEG)</p>
            <span className="text-xs text-slate-300">
              {showQuality ? `${quality}%` : "JPEG 선택 필요"}
            </span>
          </div>
          <div className="mt-3 min-h-10.5">
            {showQuality ? (
              <Slider
                value={[quality]}
                min={60}
                max={100}
                step={5}
                onValueChange={(value) => setQuality(value[0] ?? 90)}
              />
            ) : (
              <div className="flex h-10 items-center justify-center rounded-lg border border-dashed border-slate-800 text-[11px] text-slate-500">
                JPEG 선택 시 품질 슬라이더가 표시됩니다.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">해상도 (DPI)</p>
            <span className="text-xs text-slate-300">{dpi} DPI</span>
          </div>
          <div className="mt-3">
            <Slider
              value={[dpi]}
              min={100}
              max={600}
              step={100}
              onValueChange={(value) => setDpi(value[0] ?? 200)}
            />
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-slate-600">
            {DPI_OPTIONS.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">내보내기</p>
            {exportLockedToZip && (
              <span className="text-[11px] text-emerald-200">복수 페이지 선택 시 ZIP 고정</span>
            )}
          </div>
            <RadioGroup
              value={exportLockedToZip ? "zip" : exportMode}
              onValueChange={(value) => {
                if (!exportLockedToZip) {
                  setExportMode(value as "single" | "zip")
                }
              }}
              className="mt-3 flex flex-wrap items-center gap-4"
            >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="single" id="export-single" disabled={exportLockedToZip} />
              <Label htmlFor="export-single" className="text-xs text-slate-200">
                개별 파일 다운로드
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="zip" id="export-zip" />
              <Label htmlFor="export-zip" className="text-xs text-slate-200">
                ZIP 묶음 다운로드
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3">
        <button className="w-full rounded-2xl bg-emerald-400/90 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300">
          변환 시작하기
        </button>
        <p className="text-center text-xs text-slate-500">
          에러 메시지와 설명 텍스트는 임시로 넣어둔 상태입니다.
        </p>
      </CardFooter>
    </Card>
  )
}

export default ConvertForm
