from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from ..database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(String, index=True, nullable=False) # This would ideally be a ForeignKey to a users table
    amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    term_months = Column(Integer, nullable=False)
    status = Column(String, default="pending", nullable=False) # e.g., pending, approved, disbursed, repaid, defaulted
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to LoanApplication (if needed, for one-to-one or one-to-many)
    # application = relationship("LoanApplication", back_populates="loan", uselist=False)

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(String, index=True, nullable=False) # This would ideally be a ForeignKey to a hospitality_properties table
    property_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    requested_amount = Column(Float, nullable=False)
    loan_purpose = Column(String, nullable=False)
    estimated_revenue = Column(Float)
    status = Column(String, default="pending_assessment", nullable=False) # e.g., pending_assessment, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to Loan (if needed)
    # loan_id = Column(UUID(as_uuid=True), ForeignKey("loans.id"))
    # loan = relationship("Loan", back_populates="application")
