import React from "react";

interface InfoBarProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoBar: React.FC<InfoBarProps> = ({ label, value, className = "" }) => (
  <p className={className}>
    <span className=" text-gray-700 whitespace-nowrap">{label}:</span>
    <span className="text-gray-500 break-all ml-2">{value}</span>
  </p>
);

export default InfoBar;
