from django.db.models import Lookup
from django.db.models.fields import DateField
from datetime import date

@DateField.register_lookup
class SameWeek(Lookup):
    lookup_name = "same_week"

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)

        if connection.vendor == "postgresql":
            sql = (
                f"date_trunc('week', {lhs}) = date_trunc('week', {rhs})"
            )
            params = lhs_params + rhs_params
        else:
            sql = f"strftime('%%Y-%%W', {lhs}) = strftime('%%Y-%%W', {rhs})"
            params = lhs_params + rhs_params

        return sql, params


@DateField.register_lookup
class SameMonth(Lookup):
    lookup_name = "same_month"

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)

        if connection.vendor == "postgresql":
            sql = (
                f"EXTRACT(YEAR FROM {lhs}) = EXTRACT(YEAR FROM {rhs}) "
                f"AND EXTRACT(MONTH FROM {lhs}) = EXTRACT(MONTH FROM {rhs})"
            )
            params = lhs_params + rhs_params + rhs_params
        else:
            sql = f"strftime('%%Y-%%m', {lhs}) = strftime('%%Y-%%m', {rhs})"
            params = lhs_params + rhs_params

        return sql, params
