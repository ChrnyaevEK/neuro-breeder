class BreederException(Exception):
    """Tired to create exceptions and raised most general one"""


class OperationException(BreederException):
    """Something that we expect to work eventually does not"""


class DataException(BreederException):
    """Data is not as good as it used to be back then..."""
