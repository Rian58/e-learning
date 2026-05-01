"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewSubmissionButtonProps {
  content: string;
  studentName: string;
  assignmentTitle: string;
}

export function ViewSubmissionButton({ content, studentName, assignmentTitle }: ViewSubmissionButtonProps) {
  const [open, setOpen] = useState(false);
  const isLink = content.startsWith("http");

  if (isLink) {
    return (
      <a 
        href={content} 
        target="_blank" 
        rel="noreferrer" 
        className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1 break-all line-clamp-1"
      >
        <FileText className="h-3 w-3 shrink-0" /> Lihat Lampiran
      </a>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground font-medium mt-1 break-all line-clamp-2 flex items-center gap-1">
        <FileText className="h-3 w-3 shrink-0" /> {content}
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button variant="outline" size="sm" className="h-6 text-[10px] mt-2 px-2 py-0 font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300">
              <Eye className="h-3 w-3 mr-1" /> Baca Selengkapnya
            </Button>
          }
        />
        <DialogContent className="neo-card sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <FileText className="h-5 w-5" /> Isi Jawaban Tugas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-3 border-2 rounded-xl">
                <p className="text-xs text-muted-foreground font-bold">Mahasiswa</p>
                <p className="font-medium text-sm mt-0.5">{studentName}</p>
              </div>
              <div className="bg-muted p-3 border-2 rounded-xl">
                <p className="text-xs text-muted-foreground font-bold">Instruksi Tugas</p>
                <p className="font-medium text-sm mt-0.5 max-h-10 truncate">{assignmentTitle}</p>
              </div>
            </div>
            
            <div className="bg-background border-4 border-border p-4 rounded-xl">
              <p className="text-xs text-muted-foreground font-bold mb-2">Jawaban:</p>
              <ScrollArea className="max-h-[300px] w-full rounded-md">
                <div className="text-sm whitespace-pre-wrap font-medium">
                  {content}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
