import { useState, useCallback } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route } from '..'
import useJudgementParticipants from "../-hooks/useJudgementParticipants";

const participants = [
    { code: "A" },
    { code: "B" },
    { code: "C" },
    { code: "D" },
    { code: "E" },
    { code: "F" },
    { code: "G" },
    { code: "H" },
    { code: "I" },
];

const validateMark = (value: string): string | null => {
    if (!/^\d+$/.test(value)) {
        return "Only whole numbers are allowed.";
    }
    const numeric = Number(value);
    if (numeric < 1 || numeric > 100) {
        return "Value must be between 1 and 100.";
    }
    return null;
};

export default function JudgeDashboard() {
    const { eventId, itemId, judgeId } = Route.useSearch();
    const { data, isLoading, error } = useJudgementParticipants({
        eventId,
        itemId,
        judgeId,
      })
    
      if (!isLoading && error) return `Error: ${error}`
      if (!isLoading && !data) return 'No data found'
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [mark, setMark] = useState("");
    const [marks, setMarks] = useState<Record<string, string>>({});
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleCardClick = useCallback((code: string) => {
        setSelectedCode(code);
        setMark(marks[code] ?? "");
    }, [marks]);

    const handleInputChange = useCallback((value: string) => {
        setMark(value);
        setErrorMsg(validateMark(value));
    }, []);

    const handleSaveMark = useCallback(() => {
        if (!selectedCode) return;

        const validationError = validateMark(mark);
        if (validationError) {
            setErrorMsg(validationError);
            return;
        }

        setMarks(prev => ({ ...prev, [selectedCode]: mark }));
        setSelectedCode(null);
    }, [mark, selectedCode]);

    const handleCloseDialog = useCallback(() => {
        setSelectedCode(null);
        setErrorMsg(null);
    }, []);

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center gap-2">
                <span className="text-2xl">📊</span>
                <CardTitle>Participant Scoring</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {data.map((p) => (
                        <div
                            key={p.codeLetter}
                            className={`${marks[p.codeLetter] ? 'bg-green-100 hover:bg-green-200 border-green-200' : 'bg-blue-100 hover:bg-blue-200 border-blue-200'} cursor-pointer p-6 rounded-lg text-center shadow-sm border`}
                            onClick={() => handleCardClick(p.codeLetter)}
                        >
                            <div className="text-lg font-bold">{p.codeLetter}</div>
                            <div className="text-xs text-purple-600 mt-2">
                                {marks[p.codeLetter] ?? "--"}
                            </div>
                        </div>
                    ))}
                </div>

                <Dialog open={!!selectedCode} onOpenChange={handleCloseDialog}>
                    <DialogContent className="sm:max-w-md">
                        {selectedCode && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>📝 Enter Mark for {selectedCode}</DialogTitle>
                                </DialogHeader>

                                <Input
                                    placeholder="1 - 100"
                                    type="text"
                                    inputMode="numeric"
                                    value={mark}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                />

                                {errorMsg && (
                                    <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
                                )}

                                <DialogFooter className="mt-4">
                                    <Button
                                        onClick={handleSaveMark}
                                        disabled={!!errorMsg || !mark}
                                    >
                                        💾 Save Mark
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCloseDialog}
                                    >
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}