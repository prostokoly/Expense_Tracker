// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
// } from "recharts";

// const AnalyticsPanel = ({ transactions }) => {
//     const expenseByCat = {};
//     transactions.forEach((tx) => {
//         if (tx.type !== "expense") return;
//         const cat = localStorage.getItem(`cat_${tx.id}`) || "Без категории";
//         const amount = parseFloat(tx.amount) || 0;
//         expenseByCat[cat] = (expenseByCat[cat] || 0) + amount;
//     });

//     const data = Object.entries(expenseByCat).map(([name, value]) => ({
//         name,
//         value,
//     }));

//     const COLORS = [
//         "#e74c3c",
//         "#f39c12",
//         "#f1c40f",
//         "#27ae60",
//         "#3498db",
//         "#9b59b6",
//         "#95a5a6",
//     ];

//     return (
//         <div
//             style={{
//                 padding: 20,
//                 backgroundColor: "#fff",
//                 borderRadius: 10,
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//             }}
//         >
//             <h3>📊 Расходы по категориям</h3>
//             {data.length === 0 ? (
//                 <p>Нет данных для анализа</p>
//             ) : (
//                 <>
//                     <PieChart width={400} height={400}>
//                         <Pie
//                             data={data}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={120}
//                             label
//                         >
//                             {data.map((entry, index) => (
//                                 <Cell
//                                     key={`cell-${index}`}
//                                     fill={COLORS[index % COLORS.length]}
//                                 />
//                             ))}
//                         </Pie>
//                         <Tooltip formatter={(v) => `${v.toFixed(2)} ₽`} />
//                         <Legend />
//                     </PieChart>

//                     <BarChart width={500} height={300} data={data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                             dataKey="name"
//                             angle={-45}
//                             textAnchor="end"
//                             height={80}
//                         />
//                         <YAxis />
//                         <Tooltip formatter={(v) => `${v.toFixed(2)} ₽`} />
//                         <Bar dataKey="value" fill="#8884d8" />
//                     </BarChart>
//                 </>
//             )}
//         </div>
//     );
// };

// export default AnalyticsPanel;
