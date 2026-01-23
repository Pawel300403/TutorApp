from django.http import FileResponse

import io
from django.shortcuts import get_object_or_404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from clients.models import Client
from reports.pdf.billing_template import draw_billing_report

from datetime import datetime
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from reports.services import build_billing_report
from schedule.models import Schedule
from schedule.serializers import ScheduleReportSerializer


class ReportView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        month = request.data.get("month")
        client_id = request.data.get("client_id")
        
        if not month or not client_id:
            return Response(
                {"detail": "month and client_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        try:
            month_date = datetime.strptime(month, "%Y-%m")
        except ValueError:
            return Response(
                {"detail": "Invalid month format. Use YYYY-MM"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = get_object_or_404(Client, pk=client_id)

        schedules = Schedule.objects.filter(
            activity__client=client,
            status="odbylo sie",
            date__year=month_date.year,
            date__month=month_date.month,
        )
        
        serializer = ScheduleReportSerializer(schedules, many=True)
        
        report = build_billing_report(serializer_data=serializer.data, client_name=client.name, month=month)
        
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        
        draw_billing_report(p, report)
        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename="report.pdf", content_type="application/pdf")
        