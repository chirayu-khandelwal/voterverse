
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  onClick: () => void;
  variant: "for" | "against";
}

const VoteButton = ({ onClick, variant }: VoteButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200",
        variant === "for"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      )}
    >
      Vote {variant === "for" ? "For" : "Against"}
    </motion.button>
  );
};

export default VoteButton;
