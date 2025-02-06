
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
  };

  return (
    <ScrollArea className="h-[400px] rounded-lg backdrop-blur-sm bg-white/50 border border-gray-200/50 p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <AnimatePresence>
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {getStatusIcon(tx.status)}
            <div className="flex-1">
              <p className="font-medium">
                {tx.type === "vote" ? "Vote Cast" : "Proposal Created"}
              </p>
              <p className="text-sm text-gray-500 font-mono">{tx.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {new Date(tx.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(tx.timestamp).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
};

export default TransactionList;
