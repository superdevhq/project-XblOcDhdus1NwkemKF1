
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const SettingsDialog = ({
  open,
  onOpenChange,
  onSave,
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-slate-900 dark:text-slate-100">Application Settings</DialogTitle>
          </div>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Configure your Mermaid editor preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-md text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Secure API Integration</p>
            <p>
              This application uses a secure server-side API to generate diagrams. Your requests are processed securely without exposing any API keys in your browser.
            </p>
          </div>
          
          {/* Additional settings can be added here in the future */}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button 
            onClick={onSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
