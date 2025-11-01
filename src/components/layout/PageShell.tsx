import React, { PropsWithChildren } from "react";

type Props = {
  background?: string;
};

export default function PageShell({ children, background = '/assets/JoinUs_Background.png' }: PropsWithChildren<Props>) {
  return (
    <div
      style={{ backgroundImage: `url('${background}')` }}
      className="w-full min-h-[100vh] md:min-h-dvh bg-cover bg-center bg-no-repeat flex items-center justify-center py-8"
    >
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
        {children}
      </div>
    </div>
  );
}
