from datetime import datetime, timedelta, timezone

from pydantic import TypeAdapter

from app.core.time_utils import UTCDateTime, utc_now_naive


def test_naive_database_timestamp_is_serialized_as_utc():
    timestamp = TypeAdapter(UTCDateTime).validate_python(datetime(2026, 10, 26, 20, 54, 7))

    assert timestamp.tzinfo == timezone.utc
    assert TypeAdapter(UTCDateTime).dump_python(timestamp, mode="json") == "2026-10-26T20:54:07Z"


def test_aware_timestamp_is_normalized_to_utc():
    local_timestamp = datetime(2026, 10, 27, 2, 24, 7, tzinfo=timezone(timedelta(hours=5, minutes=30)))

    assert TypeAdapter(UTCDateTime).validate_python(local_timestamp) == datetime(
        2026, 10, 26, 20, 54, 7, tzinfo=timezone.utc
    )


def test_utc_now_naive_returns_naive_utc_timestamp():
    timestamp = utc_now_naive()
    current_utc = datetime.now(timezone.utc).replace(tzinfo=None)

    assert timestamp.tzinfo is None
    assert abs((current_utc - timestamp).total_seconds()) < 1
