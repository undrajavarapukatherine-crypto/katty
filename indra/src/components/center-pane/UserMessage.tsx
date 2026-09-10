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
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-700/30"
              >
                <Paperclip className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-300">{att.name}</span>
                <span className="text-[10px] text-zinc-600 ml-auto">{att.size}</span>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-zinc-800/70 border border-zinc-700/30">
          <p className="text-sm text-zinc-200">{message.content}</p>
          <p className="text-[10px] text-zinc-600 mt-1 text-right">{message.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
