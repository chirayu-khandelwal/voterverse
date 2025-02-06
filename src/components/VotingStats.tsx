
import { motion } from "framer-motion";
import { VotingStats as VotingStatsType } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  delay: number;
}

const StatCard = ({ title, value, unit, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="w-full"
  >
    <Card className="p-6 backdrop-blur-sm bg-white/50 border border-gray-200/50 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-semibold mt-2">
        {value.toLocaleString()}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </p>
    </Card>
  </motion.div>
);

const VotingStats = ({ stats }: { stats: VotingStatsType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Votes Cast"
        value={stats.totalVotes}
        delay={0}
      />
      <StatCard
        title="Active Proposals"
        value={stats.activeProposals}
        delay={0.1}
      />
      <StatCard
        title="Participation Rate"
        value={stats.participationRate}
        unit="%"
        delay={0.2}
      />
      <StatCard
        title="Completed Proposals"
        value={stats.completedProposals}
        delay={0.3}
      />
    </div>
  );
};

export default VotingStats;
