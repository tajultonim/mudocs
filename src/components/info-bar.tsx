import React from "react";

interface InfoBarProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoBar: React.FC<InfoBarProps> = ({ label, value, className = "" }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    <span className=" text-gray-300 whitespace-nowrap">{label}:</span>
    <span className="text-gray-400 break-all">{value}</span>
  </div>
);

export default InfoBar;
