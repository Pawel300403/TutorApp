from datetime import datetime

MONTHS_PL = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]


def build_billing_report(serializer_data: list[dict], client_name: str, month: str) -> dict:

    month_date = datetime.strptime(month, "%Y-%m")
    month_label = f"{MONTHS_PL[month_date.month - 1].capitalize()} {month_date.year}"

    reportData = []
    for s in serializer_data:
        base_duration = s["activity"]["base_duration"]
        duration = s["duration"]
        reportData.append({
            "date": s["date"],
            "base_duration": base_duration,
            "count": duration / base_duration if base_duration else 0,
            "price": float(s["charge"]),
            "activity_id": s["activity"]["id"],
            "activity_name": s["activity"]["name"],
        })

    activities_id = set(r["activity_id"] for r in reportData)

    activities = []
    grand_total = 0.0

    for a in activities_id:
        activity_name = ""
        date_lines = []
        lessons_count = 0
        total_cost = 0.0

        for r in reportData:
            if a == r["activity_id"]:
                if activity_name == "":
                    activity_name = r["activity_name"]

                date_lines.append({
                    "date": r["date"],
                    "text": f"{int(r['count'])}x{int(r['base_duration'])}min",
                })

                lessons_count += r["count"]
                total_cost += r["price"]

        activities.append({
            "activity_name": activity_name,
            "date_lines": date_lines,
            "lessons_count": int(lessons_count),
            "total_cost": round(total_cost, 2),
        })

        grand_total += total_cost

    report = {
        "client_name": client_name,
        "month_label": month_label,
        "activities": activities,
        "grand_total": round(grand_total, 2),
    }

    return report
