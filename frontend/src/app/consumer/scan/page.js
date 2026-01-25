import { Suspense } from "react";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import ScanContent from "./ScanContent";
import { Loader2 } from "lucide-react";

function ScanLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Loading Scanner
      </h2>
      <p className="text-slate-500">Please wait...</p>
    </div>
  );
}

export default function ConsumerScan() {
  return (
    <ConsumerLayout>
      <Suspense fallback={<ScanLoadingFallback />}>
        <ScanContent />
      </Suspense>
    </ConsumerLayout>
  );
}
