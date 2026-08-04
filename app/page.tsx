import { races } from "@/lib/data/races";
import { RacesExplorer } from "@/components/races/RacesExplorer";

export default function Home() {
  return <RacesExplorer races={races} />;
}
