import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface SumsubWidgetProps {
  accessToken: string;
  containerId: string;
  onApplicantSubmitted: () => void;
  onApplicantApproved?: () => void;
  onError?: (error: unknown) => void;
}

export default function SumsubWidget({
  accessToken,
  containerId,
  onApplicantSubmitted,
  onApplicantApproved,
  onError,
}: SumsubWidgetProps) {
  const sdkRef = useRef<{ destroy?: () => void } | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const snsWebSdk = ((await import("@sumsub/websdk")) as any).default;

        if (sdkRef.current?.destroy) {
          try {
            sdkRef.current.destroy();
          } catch {
            // ignore cleanup errors
          }
          sdkRef.current = null;
        }

        const sdk = snsWebSdk
          .init(accessToken, () => Promise.resolve(accessToken))
          .withConf({ lang: "en" })
          .withOptions({ addViewportTag: false, adaptIframeHeight: true })
          .onMessage((type: string, payload: unknown) => {
            if (type === "idCheck.onApplicantSubmitted" || type === "idCheck.onApplicantResubmitted") {
              onApplicantSubmitted();
            } else if (type === "idCheck.onApplicantStatusChanged") {
              const p = payload as { reviewStatus?: string; reviewResult?: { reviewAnswer?: string } };
              if (
                p?.reviewResult?.reviewAnswer === "GREEN" ||
                p?.reviewStatus === "completed"
              ) {
                onApplicantApproved?.();
              }
            } else if (type === "idCheck.onError") {
              console.error("Sumsub error:", payload);
              onError?.(payload);
            }
          })
          .build();

        if (mountedRef.current) {
          sdkRef.current = sdk;
          sdk.launch(`#${containerId}`);
        } else {
          try {
            sdk.destroy?.();
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error("Failed to initialize Sumsub SDK:", err);
        onError?.(err);
      }
    };

    init();

    return () => {
      mountedRef.current = false;
      if (sdkRef.current?.destroy) {
        try {
          sdkRef.current.destroy();
        } catch {
          // ignore
        }
        sdkRef.current = null;
      }
    };
  }, [accessToken, containerId]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border bg-background" style={{ minHeight: 400 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground opacity-50" />
      </div>
      <div id={containerId} className="relative z-10 w-full" />
    </div>
  );
}
