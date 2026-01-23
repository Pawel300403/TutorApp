from django.db.models import Lookup
from django.db.models.fields import DateField
from datetime import date

@DateField.register_lookup
class SameWeek(Lookup):
    lookup_name = "same_week"

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)

        # dla SQLite i większości baz używamy funkcji strftime('%W', date)
        sql = f"strftime('%%Y-%%W', {lhs}) = strftime('%%Y-%%W', {rhs})"
        params = lhs_params + rhs_params
        return sql, params


@DateField.register_lookup
class SameMonth(Lookup):
    lookup_name = "same_month"

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)

        # porównanie roku i miesiąca
        sql = f"strftime('%%Y-%%m', {lhs}) = strftime('%%Y-%%m', {rhs})"
        params = lhs_params + rhs_params
        return sql, params
