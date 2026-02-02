import { Card } from "./components/ui/card"
import ConvertForm from "./components/convert-form"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] h-80 w-80 rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full bg-sky-400/20 blur-[140px]" />
      </div>

      <header className="relative z-10">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/30">
              P2I
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">PDF To Image</p>
              <p className="text-xs text-slate-400">Client-side secure converter</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a className="transition hover:text-white" href="#how">
              사용 방법
            </a>
            <a className="transition hover:text-white" href="#security">
              보안 원칙
            </a>
            <a className="transition hover:text-white" href="#faq">
              FAQ
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-8 md:flex-row md:items-center md:pt-12">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs text-emerald-100">
              업로드 없음 · 브라우저 내부 처리 · 보안 문서 전용
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              PDF를 안전하게 이미지로.
              <br />
              서버로 보내지 않는 변환.
            </h1>
            <p className="text-base text-slate-300 md:text-lg">
              민감한 계약서, 인감증명, 신분증 스캔본까지. 파일은 브라우저 안에서만
              처리되고 외부로 전송되지 않습니다.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="group relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-emerald-400/50 bg-emerald-400/10 px-6 py-4 text-sm font-medium text-emerald-50 transition hover:bg-emerald-400/20">
                PDF 파일 선택
                <input className="absolute inset-0 hidden" type="file" accept="application/pdf" />
              </label>
              <button className="rounded-2xl border border-slate-700 px-6 py-4 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white">
                변환 방식 알아보기
              </button>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                네트워크 업로드 0건
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                브라우저 메모리에서만 처리
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ConvertForm />
          </div>
        </section>

        <section id="how" className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold">3단계로 끝내는 로컬 변환</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">
              서버를 거치지 않는 흐름이라 민감한 문서도 안심하고 처리할 수 있습니다.
              변환 작업은 브라우저의 워커에서 수행됩니다.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "PDF 선택",
                desc: "브라우저에서 파일을 불러오면 즉시 로컬 메모리로만 로드됩니다.",
              },
              {
                step: "02",
                title: "옵션 조정",
                desc: "페이지 범위, 해상도, 포맷을 고른 뒤 즉시 변환합니다.",
              },
              {
                step: "03",
                title: "다운로드",
                desc: "페이지별 이미지 또는 ZIP 파일로 한 번에 내려받습니다.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="rounded-3xl border-slate-800 bg-slate-900/40 px-6 py-6 shadow-none"
              >
                <p className="text-xs text-emerald-200">{item.step}</p>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="security" className="mx-auto w-full max-w-6xl px-6 py-16">
          <Card className="rounded-3xl border-slate-800 bg-slate-900/40 px-8 py-8 shadow-none">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Security</p>
                <h2 className="mt-3 text-3xl font-semibold">보안 약속</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                  사용자의 파일은 브라우저 외부로 나가지 않습니다. 변환 과정은 로컬 워커에서
                  진행되며, 설정이나 파일 정보를 서버에 저장하지 않습니다.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900">
                  보안 안내서 보기
                </button>
                <button className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-200">
                  개인정보 처리 없음
                </button>
              </div>
            </div>
          </Card>
        </section>

        <section id="faq" className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold">자주 묻는 질문</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">
              초기 버전에서는 이미지 변환과 다운로드에 집중합니다. 이후 OCR, 페이지 편집 기능을
              확장할 예정입니다.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "파일이 실제로 서버로 전송되지 않나요?",
                a: "변환 과정은 브라우저 내부 워커에서만 진행되며, 네트워크 업로드를 수행하지 않습니다.",
              },
              {
                q: "대용량 PDF도 처리할 수 있나요?",
                a: "브라우저 메모리 제한 내에서 처리됩니다. 고해상도 변환 시 페이지 수를 나눠주세요.",
              },
              {
                q: "오프라인에서도 쓸 수 있나요?",
                a: "서비스 워커 적용 후 오프라인 모드도 지원할 계획입니다.",
              },
              {
                q: "이미지 품질을 조정할 수 있나요?",
                a: "DPI, 포맷, 페이지 범위를 옵션으로 제공할 예정입니다.",
              },
            ].map((item) => (
              <Card
                key={item.q}
                className="rounded-3xl border-slate-800 bg-slate-900/40 px-6 py-6 shadow-none"
              >
                <h3 className="text-sm font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">PDF To Image</p>
            <p className="text-xs text-slate-500">브라우저에서 끝나는 보안 변환 서비스</p>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <span>개인정보처리 없음</span>
            <span>서버 저장 없음</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
