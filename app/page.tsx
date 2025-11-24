import { Hero } from "@/components/home/hero";
import { TestGrid } from "@/components/home/test-grid";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <TestGrid />
    </div>
  );
}
