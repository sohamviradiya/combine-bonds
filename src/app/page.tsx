"use client";
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';
export default function Home() {
    redirect('/home', RedirectType.replace);
}


