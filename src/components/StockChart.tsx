"use client";

import { ValuePoint } from "types/stock.interface";

import React from "react";
import dynamic from "next/dynamic";
import type { Chart as ChartType } from "react-charts";
const Chart = dynamic(() => import('react-charts').then((mod) => mod.Chart), {
     ssr: false,
}) as typeof ChartType;
import { AxisOptions } from "react-charts";

type ValuePointSeries = {
     label: string;
     data: ValuePoint[];
};

export function StockPriceChartComponent({ timeline }: { timeline: ValuePoint[] }) {

     
     const data: ValuePointSeries[] = [
          {
               label: "Stock Price Variations",
               data: timeline
          }
     ];
     const primaryAxis = React.useMemo(
          (): AxisOptions<ValuePoint> => ({
               getValue: (value_point: ValuePoint) => value_point.date,
          }),
          []
     );
     const secondaryAxes = React.useMemo(
          (): AxisOptions<ValuePoint>[] => [
               {
                    getValue: (value_point: ValuePoint) => value_point.market_valuation,
               },
          ],
          []
     );
     return (
          <Chart options={{ data, primaryAxis, secondaryAxes }} />
     );
};

export function StockVolumeChartComponent({ timeline }: { timeline: ValuePoint[] }) {

     const data: ValuePointSeries[] = [
          {
               label: "Stock Volume Variations",
               data: timeline
          }
     ];
     const primaryAxis = React.useMemo(
          (): AxisOptions<ValuePoint> => ({
               getValue: (value_point: ValuePoint) => value_point.date,
          }),
          []
     );
     const secondaryAxes = React.useMemo(
          (): AxisOptions<ValuePoint>[] => [
               {
                    getValue: (value_point: ValuePoint) => value_point.volume_in_market,
               },
          ],
          []
     );
     return (
          <Chart options={{ data, primaryAxis, secondaryAxes }} />
     );
}


