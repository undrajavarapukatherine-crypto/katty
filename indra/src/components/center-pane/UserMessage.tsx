'use client';

import { Paperclip } from 'lucide-react';
import type { Message } from '@/store/indra-store';

export default function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%]">
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-1">
            {message.attachments.map((att, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs"
              >
                <Paperclip className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-xs text-slate-800 font-medium">{att.name}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{att.size}</span>
              </div>
            ))}
          </div>
        )}
        <div className="px-4.5 py-3.5 rounded-2xl rounded-br-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
          <p className="text-sm font-medium leading-relaxed">{message.content}</p>
          <p className="text-[10px] text-violet-200 mt-1.5 text-right font-mono">{message.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
