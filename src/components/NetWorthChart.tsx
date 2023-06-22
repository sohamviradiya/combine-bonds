"use client";

import { NetWorthPoint } from "types/portfolio.interface";
import React from "react";
import nextDynamic from "next/dynamic";
import type { Chart as ChartType } from "react-charts";
const Chart = nextDynamic(() => import('react-charts').then((mod) => mod.Chart), {
     ssr: false,
}) as typeof ChartType;

import { AxisOptions } from "react-charts";

type NetWorthPointSeries = {
     label: string;
     data: NetWorthPoint[];
};

export function NetWorthChartComponent({ netWorth }: { netWorth: NetWorthPoint[] }) {

     const data: NetWorthPointSeries[] = [
          {
               label: "Stock Price Variations",
               data: netWorth
          }
     ];
     const primaryAxis = React.useMemo(
          (): AxisOptions<NetWorthPoint> => ({
               getValue: (net_worth_point: NetWorthPoint) => net_worth_point.date,
          }),
          []
     );
     const secondaryAxes = React.useMemo(
          (): AxisOptions<NetWorthPoint>[] => [
               {
                    getValue: (net_worth_point: NetWorthPoint) => net_worth_point.value,
               },
          ],
          []
     );
     return (
          <Chart options={{ data, primaryAxis, secondaryAxes }} />
     );
};


export const revalidate = 0;
export const dynamic = 'force-dynamic';

