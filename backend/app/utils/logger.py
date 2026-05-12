import logging
import sys

LOG = logging.getLogger("ai_portfolio")
_handler = logging.StreamHandler(sys.stdout)
_handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
if not LOG.handlers:
    LOG.addHandler(_handler)
LOG.setLevel(logging.INFO)
