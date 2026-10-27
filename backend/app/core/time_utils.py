from datetime import datetime, timezone
from typing import Annotated

from pydantic import AfterValidator


def normalize_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


UTCDateTime = Annotated[datetime, AfterValidator(normalize_utc)]


def utc_now_naive() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)
