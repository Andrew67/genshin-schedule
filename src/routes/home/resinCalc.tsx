import { h } from "preact";
import { css, cx } from "emotion";
import { useMemo, useRef } from "preact/hooks";
import { useConfig } from "../../configs";
import { clampResin, getResinRecharge, ResinCap } from "../../db/resins";
import { useRerenderFrequency } from "../../time";

function useMeasuredTextWidth(className: string, text: string) {
  return useMemo(() => {
    const span = document.createElement("span");
    span.className = className;
    span.innerText = text;

    document.body.appendChild(span);
    const width = span.getBoundingClientRect().width;
    document.body.removeChild(span);

    return width;
  }, [className, text]);
}

const ResinCalculator = () => {
  const [resin, setResin] = useConfig("resin");
  const resinInput = useRef<HTMLInputElement>(null);

  useRerenderFrequency(1000);

  const current = useMemo(() => {
    return resin.value + getResinRecharge(Date.now() - resin.time);
  }, [resin]);

  const inputWidth = useMeasuredTextWidth(
    "text-xl font-bold",
    clampResin(current).toString()
  );

  return (
    <div className="space-y-4">
      <div className="text-lg">Resin calculator</div>

      <div className="bg-white text-black rounded p-4 space-y-2 flex flex flex-col shadow-lg">
        <div className="flex flex-row space-x-2">
          <img src="/assets/game/resin.png" className="w-10 h-10" />

          <input
            ref={resinInput}
            type="number"
            style={{ maxWidth: inputWidth }}
            className={cx(
              "flex-1 text-xl font-bold text-right",
              css`
                background: transparent;
                -moz-appearance: textfield;

                ::-webkit-outer-spin-button,
                ::-webkit-inner-spin-button {
                  /* display: none; <- Crashes Chrome on hover */
                  -webkit-appearance: none;
                  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
                }
              `
            )}
            min={0}
            max={ResinCap}
            value={clampResin(current)}
            onClick={() => resinInput.current.select()}
            onInput={({ currentTarget: { valueAsNumber } }) =>
              setResin({
                value: Math.max(0, Math.min(ResinCap, valueAsNumber || 0)),
                time: Date.now()
              })
            }
          />

          <div className="flex flex-col justify-center">/{ResinCap}</div>
        </div>

        {useMemo(
          () => (
            <div className="text-xs text-gray-600 ml-2 pl-10">
              <div>
                {clampResin(current + getResinRecharge(2 * 3600000))} in 2 hours
              </div>
              <div>
                {clampResin(current + getResinRecharge(4 * 3600000))} in 4 hours
              </div>
              <div>
                {clampResin(current + getResinRecharge(8 * 3600000))} in 8 hours
              </div>
              <div>
                {clampResin(current + getResinRecharge(12 * 3600000))} in 12
                hours
              </div>
            </div>
          ),
          [current]
        )}
      </div>
    </div>
  );
};

export default ResinCalculator;