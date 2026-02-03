import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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

type ConvertFormValues = {
  file: File | null
  pageMode: "all" | "range"
  pageRange: string
  format: "png" | "jpeg"
  quality: number | null
  dpi: number
  exportMode: "single" | "zip"
}

const convertFormSchema = z
  .object({
    file: z
      .instanceof(File)
      .nullable()
      .refine((file) => file !== null, { message: "PDF 파일을 선택해주세요." })
      .refine((file) => (file ? file.type === "application/pdf" : true), {
        message: "PDF 파일만 업로드할 수 있습니다.",
      }),
    pageMode: z.enum(["all", "range"]),
    pageRange: z.string(),
    format: z.enum(["png", "jpeg"]),
    quality: z.number().min(60).max(100).nullable(),
    dpi: z.number().min(100).max(600),
    exportMode: z.enum(["single", "zip"]),
  })
  .refine(
    (values) => (values.pageMode === "range" ? values.pageRange.trim().length > 0 : true),
    {
      message: "페이지 범위를 입력해주세요.",
      path: ["pageRange"],
    }
  )
  .refine(
    (values) => {
      if (values.pageMode !== "range") return true
      const normalized = values.pageRange.replace(/\s+/g, "")
      const rangePattern = /^(\d+(-\d+)?)(,(\d+(-\d+)?))*$/
      return rangePattern.test(normalized)
    },
    {
      message: "페이지 범위는 1 또는 1-3 형식만 쉼표로 구분해 입력해주세요.",
      path: ["pageRange"],
    }
  )
  .refine(
    (values) => {
      if (values.pageMode !== "range") return true
      const normalized = values.pageRange.replace(/\s+/g, "")
      if (!normalized) return false
      const tokens = normalized.split(",")
      return tokens.every((token) => {
        const parts = token.split("-")
        if (parts.length === 1) {
          const num = Number(parts[0])
          return Number.isInteger(num) && num >= 1
        }
        if (parts.length === 2) {
          const start = Number(parts[0])
          const end = Number(parts[1])
          return (
            Number.isInteger(start) &&
            Number.isInteger(end) &&
            start >= 1 &&
            end >= 1 &&
            start <= end
          )
        }
        return false
      })
    },
    {
      message: "페이지는 1 이상 숫자만 가능하며 범위는 시작 ≤ 끝 이어야 합니다.",
      path: ["pageRange"],
    }
  )
  .refine((values) => (values.format === "jpeg" ? values.quality !== null : true), {
    message: "JPEG 선택 시 품질 값을 입력해주세요.",
    path: ["quality"],
  })

function normalizeRangeInput(value: string) {
  return value.replace(/\s+/g, "")
}

function hasMultiplePages(rangeInput: string) {
  if (!rangeInput) return false
  return /[,-]/.test(rangeInput)
}

function ConvertForm() {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvertFormValues>({
    resolver: zodResolver(convertFormSchema),
    defaultValues: {
      file: null,
      pageMode: "all",
      pageRange: "",
      format: "png",
      quality: 90,
      dpi: 200,
      exportMode: "single",
    },
  })

  const pageMode = watch("pageMode")
  const format = watch("format")
  const pageRange = watch("pageRange")
  const quality = watch("quality")
  const dpi = watch("dpi")
  const exportMode = watch("exportMode")

  const normalizedRange = useMemo(() => normalizeRangeInput(pageRange ?? ""), [pageRange])
  const isMultipleRange = pageMode === "range" && hasMultiplePages(normalizedRange)
  const exportLockedToZip = isMultipleRange
  const showQuality = format === "jpeg"

  const onSubmit = (values: ConvertFormValues) => {
    console.log(values)
  }

  useEffect(() => {
    if (exportLockedToZip) {
      setValue("exportMode", "zip")
    }
  }, [exportLockedToZip, setValue])

  return (
    <Card className="rounded-3xl bg-white/80 shadow-2xl dark:bg-slate-900/60">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-sm font-semibold">변환 옵션</CardTitle>
          <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
            PDF를 이미지로 변환하기 전에 필요한 설정을 선택하세요.
          </CardDescription>
          <CardAction>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-100">
              로컬 처리
            </span>
          </CardAction>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <fieldset className="rounded-2xl border bg-slate-50/80 px-4 py-4 md:col-span-2 dark:bg-slate-950/80">
            <legend className="px-2 text-xs font-semibold text-slate-700 dark:text-slate-200">페이지 선택</legend>
            <div className="mt-2 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pdf-file" className="text-xs text-slate-700 dark:text-slate-200">
                  PDF 파일
                </Label>
                <Controller
                  control={control}
                  name="file"
                  render={({ field, fieldState }) => (
                    <Input
                      id="pdf-file"
                      type="file"
                      accept="application/pdf"
                      className="h-9 border-slate-300 bg-white text-xs text-slate-900 file:text-xs file:font-medium dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
                      aria-invalid={fieldState.invalid}
                      onChange={(event) => field.onChange(event.target.files?.[0] ?? null)}
                    />
                  )}
                />
                {errors.file?.message && (
                  <p className="text-xs text-rose-500 dark:text-rose-400">{errors.file.message}</p>
                )}
              </div>

              <Controller
                control={control}
                name="pageMode"
                render={({ field, fieldState }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap items-center gap-4"
                    aria-invalid={fieldState.invalid}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="page-all" />
                      <Label htmlFor="page-all" className="text-xs text-slate-700 dark:text-slate-200">
                        전체 페이지
                      </Label>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <RadioGroupItem value="range" id="page-range" />
                      <Label htmlFor="page-range" className="text-xs text-slate-700 dark:text-slate-200">
                        범위 지정
                      </Label>
                      <Controller
                        control={control}
                        name="pageRange"
                        render={({ field: rangeField, fieldState: rangeState }) => (
                          <Input
                            id="page-range-input"
                            aria-label="페이지 범위 입력"
                            className={`h-9 min-w-[200px] flex-1 border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:placeholder:text-slate-600 ${
                              pageMode === "range" ? "" : "hidden"
                            }`}
                            placeholder="예: 1-5, 8, 10-12"
                            value={rangeField.value}
                            onChange={rangeField.onChange}
                            disabled={pageMode !== "range"}
                            aria-invalid={rangeState.invalid}
                          />
                        )}
                      />
                    </div>
                  </RadioGroup>
                )}
              />

              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                여러 페이지를 지정할 수 있습니다. 예: 1-5, 8, 10-12
              </p>
              {errors.pageRange?.message && (
                <p className="text-xs text-rose-500 dark:text-rose-400">
                  {errors.pageRange.message}
                </p>
              )}
            </div>
          </fieldset>

        <div className="rounded-2xl border bg-slate-50/80 px-4 py-4 dark:bg-slate-950/80">
          <p className="text-xs text-slate-500 dark:text-slate-400">이미지 포맷</p>
          <Controller
            control={control}
            name="format"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-3 grid gap-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="png" id="format-png" />
                  <Label htmlFor="format-png" className="text-xs text-slate-700 dark:text-slate-200">
                    PNG (무손실)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="jpeg" id="format-jpeg" />
                  <Label htmlFor="format-jpeg" className="text-xs text-slate-700 dark:text-slate-200">
                    JPEG (용량 절약)
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <div className="rounded-2xl border bg-slate-50/80 px-4 py-4 dark:bg-slate-950/80">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">품질 (JPEG)</p>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {showQuality ? `${quality ?? 0}%` : "JPEG 선택 필요"}
            </span>
          </div>
          <div className="mt-3 min-h-[42px]">
            <Controller
              control={control}
              name="quality"
              render={({ field }) =>
                showQuality ? (
                  <Slider
                    value={[field.value ?? 90]}
                    min={60}
                    max={100}
                    step={5}
                    onValueChange={(value) => field.onChange(value[0] ?? 90)}
                  />
                ) : (
                  <div className="flex h-10 items-center justify-center rounded-lg border border-dashed text-[11px] text-slate-500 dark:text-slate-500">
                    JPEG 선택 시 품질 슬라이더가 표시됩니다.
                  </div>
                )
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-50/80 px-4 py-4 md:col-span-2 dark:bg-slate-950/80">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">해상도 (DPI)</p>
            <span className="text-xs text-slate-600 dark:text-slate-300">{dpi} DPI</span>
          </div>
          <div className="mt-3">
            <Controller
              control={control}
              name="dpi"
              render={({ field }) => (
                <Slider
                  value={[field.value]}
                  min={100}
                  max={600}
                  step={100}
                  onValueChange={(value) => field.onChange(value[0] ?? 200)}
                />
              )}
            />
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-slate-500 dark:text-slate-600">
            {DPI_OPTIONS.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-50/80 px-4 py-4 md:col-span-2 dark:bg-slate-950/80">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">내보내기</p>
            {exportLockedToZip && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-200">
                복수 페이지 선택 시 ZIP 고정
              </span>
            )}
          </div>
          <Controller
            control={control}
            name="exportMode"
            render={({ field }) => (
              <RadioGroup
                value={exportLockedToZip ? "zip" : field.value}
                onValueChange={(value) => {
                  if (!exportLockedToZip) {
                    field.onChange(value)
                  }
                }}
                className="mt-3 flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="single" id="export-single" disabled={exportLockedToZip} />
                  <Label htmlFor="export-single" className="text-xs text-slate-700 dark:text-slate-200">
                    개별 파일 다운로드
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="zip" id="export-zip" />
                  <Label htmlFor="export-zip" className="text-xs text-slate-700 dark:text-slate-200">
                    ZIP 묶음 다운로드
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-3">
          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-500/90 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            변환 시작하기
          </button>
          <p className="text-center text-xs text-slate-500 dark:text-slate-500">
            에러 메시지와 설명 텍스트는 임시로 넣어둔 상태입니다.
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ConvertForm
