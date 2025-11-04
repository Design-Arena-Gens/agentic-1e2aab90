import { AgentProvider } from "@/components/AgentContext";
import Planner from "@/components/Planner";
import FlightForm from "@/components/FlightForm";
import HotelForm from "@/components/HotelForm";

export default function Page() {
  return (
    <AgentProvider>
      <div className="grid">
        <Planner />
        <div className="grid">
          <FlightForm />
          <HotelForm />
        </div>
      </div>
    </AgentProvider>
  );
}
