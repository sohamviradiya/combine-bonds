"use client";

type ValuePoint = {
     date: number;
     market_valuation: number;
     volume_in_market: number;
};
import { Chart } from "react-charts";
import React from "react";
import { AxisOptions } from "react-charts/types/types";

type Series = {
     label: string;
     data: ValuePoint[];
};

export function ChartComponent({ timeline }: { timeline: ValuePoint[] }) {
     
     const data: Series[] = [
          {
               label: "Series 1",
               data: timeline
          }
     ];
     const primaryAxis = React.useMemo(
          (): AxisOptions<ValuePoint> => ({
               getValue: (datum: ValuePoint) => datum.date,
          }),
          []
     );
     const secondaryAxes = React.useMemo(
          (): AxisOptions<ValuePoint>[] => [
               {
                    getValue: (datum: ValuePoint) => datum.market_valuation,
               },
          ],
          []
     );
     return (
          <Chart options={{ data, primaryAxis, secondaryAxes }} />
     );
};


