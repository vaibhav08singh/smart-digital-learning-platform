import {
  Calculator,
  FlaskConical,
  Languages,
  Globe,
  Laptop,
  Brain,
  BarChart3,
  Shield,
  Cloud,
  Code2,
  Cog,
  Briefcase,
  Cpu,
  Palette,
  Microscope,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DomainIcon({
  domainId,
  className = "h-5 w-5",
}: {
  domainId: string;
  className?: string;
}) {
  switch (domainId) {
    case "d-math":
      return <Calculator className={cn("h-5 w-5", className)} />;
    case "d-science":
      return <FlaskConical className={cn("h-5 w-5", className)} />;
    case "d-language":
      return <Languages className={cn("h-5 w-5", className)} />;
    case "d-social":
      return <Globe className={cn("h-5 w-5", className)} />;
    case "d-cs":
      return <Laptop className={cn("h-5 w-5", className)} />;
    case "d-ai":
      return <Brain className={cn("h-5 w-5", className)} />;
    case "d-data":
      return <BarChart3 className={cn("h-5 w-5", className)} />;
    case "d-security":
      return <Shield className={cn("h-5 w-5", className)} />;
    case "d-cloud":
      return <Cloud className={cn("h-5 w-5", className)} />;
    case "d-web":
      return <Code2 className={cn("h-5 w-5", className)} />;
    case "d-se":
      return <Cog className={cn("h-5 w-5", className)} />;
    case "d-business":
      return <Briefcase className={cn("h-5 w-5", className)} />;
    case "d-engineering":
      return <Cpu className={cn("h-5 w-5", className)} />;
    case "d-humanities":
      return <Palette className={cn("h-5 w-5", className)} />;
    case "d-research":
      return <Microscope className={cn("h-5 w-5", className)} />;
    default:
      return <Sparkles className={cn("h-5 w-5", className)} />;
  }
}
