import { rules } from "@/src/rules";

export default function RulesPage() {
  return (
    <ul>
      {Object.keys(rules).map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>
  );
}
