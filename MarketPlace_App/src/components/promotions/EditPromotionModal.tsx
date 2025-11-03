import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { IPromotionResponse } from "../Services/Promotions/PromotionService";
import PromotionService from "../Services/Promotions/PromotionService";
import type { IIdNameModel, IIdNameValueModel } from "../../common/IIdNameModel";
import dayjs from "dayjs";

interface EditPromotionModalProps {
  show: boolean;
  onHide: () => void;
  promotionData: IPromotionResponse | null;
  onSave: (data: IPromotionResponse) => void;
}


const validationSchema = Yup.object().shape({
  promotionTypeId: Yup.number().required("Promotion Type is required"),
  promotionName: Yup.string().required("Promotion Name is required"),
  promotionDescription: Yup.string().required("Description is required"),
});

const EditPromotionModal: React.FC<EditPromotionModalProps> = ({
  show,
  onHide,
  promotionData,
  onSave,
}) => {
  const [sailDates, setSailDates] = useState<IIdNameValueModel<number>[]>([]);
  const [destinations, setDestinations] = useState<IIdNameModel<number>[]>([]);
  const [cruiseLines, setCruiseLines] = useState<IIdNameModel<number>[]>([]);
  const [groupId, setGroupId] = useState<IIdNameModel<number>[]>([]);
  const [promotionTypes, setPromotionTypes] = useState<IIdNameModel<number>[]>([]);


  // Fetch sail dates on mount
  useEffect(() => {
    const fetchSailDates = async () => {
      try {
        const res = await PromotionService.getAllSailDates();
        if (res.data) {
          setSailDates(res.data);
        }
      } catch (err) {
        console.error("Error fetching sail dates:", err);
      }
    };
    fetchSailDates();
    PromotionService.getPromotionType().then((res) => {
      if (res.data) {
        setPromotionTypes(res.data);
      }
    })
  }, []);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" keyboard={false}>
      <Formik
        enableReinitialize
        initialValues={
          promotionData
            ? {
              ...promotionData,
              startDate: promotionData.startDate ? dayjs(promotionData.startDate).format("YYYY-MM-DD") : null,
              endDate: promotionData.endDate ? dayjs(promotionData.endDate).format("YYYY-MM-DD") : null,
              sailDate: promotionData.sailDate || null,
              destinationId: promotionData.destinationId || null,
              cruiseLineId: promotionData.cruiseLineId || null,
              groupId: promotionData.groupId || null,

            }
            : {
              id: null,
              promotionTypeId: null,
              promotionName: "",
              promotionDescription: "",
              discountPer: "",
              discountAmount: null,
              promoCode: "",
              loyaltyLevel: "",
              isFirstTimeCustomer: false,
              minNoOfAdultRequired: null,
              minNoOfChildRequired: null,
              isAdultTicketDiscount: false,
              isChildTicketDiscount: false,
              minPassengerAge: null,
              maxPassengerAge: null,
              passengerType: "",
              cabinCountRequired: null,
              sailingId: null,
              supplierId: null,
              affiliateName: "",
              includesAirfare: false,
              includesHotel: false,
              includesWiFi: false,
              includesShoreExcursion: false,
              onboardCreditAmount: null,
              freeNthPassenger: null,
              startDate: null,
              endDate: null,
              isStackable: false,
              isActive: false,
              sailDate: null,
              destinationId: null,
              cruiseLineId: null,
              groupId: null,
            }
        }
        validationSchema={validationSchema}
        onSubmit={(values) => onSave(values as IPromotionResponse)}
      >
        {({ handleChange, values, setFieldValue }) => {
          // Fetch destinations + cruise lines whenever sailDate changes
          useEffect(() => {
            if (values.sailDate) {
              const fetchData = async () => {
                try {
                  const [destinationRes, cruiseLineRes, groupIdRes] = await Promise.all([
                    PromotionService.getDestinationBySailDate(values.sailDate),
                    PromotionService.getCruiseLineBySailDate(values.sailDate),
                    PromotionService.getGroupIdBySailDate(values.sailDate),

                  ]);
                  setDestinations(destinationRes.data || []);
                  setCruiseLines(cruiseLineRes.data || []);
                  setGroupId(groupIdRes.data || [])
                  setFieldValue("destinationId", "");
                  setFieldValue("cruiseLineId", "");
                } catch (err) {
                  console.error("Error fetching destinations/cruise lines:", err);
                }
              };
              fetchData();
            }
          }, [values.sailDate, setFieldValue]);

          return (
            <FormikForm>
              <Modal.Header closeButton>
                <Modal.Title>{values.id ? "Edit Promotion" : "Add Promotion"}</Modal.Title>
              </Modal.Header>

              <Modal.Body className="px-4 py-3">
                <Row className="g-3">
                  {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

                  {/* Promotion Type */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Promotion Type*</Form.Label>
                      <Form.Select name="promotionTypeId" value={values.promotionTypeId as any} onChange={handleChange}>
                        <option value="">--Select--</option>
                        {promotionTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage name="promotionTypeId" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Promotion Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Promotion Name*</Form.Label>
                      <Form.Control type="text" name="promotionName" value={values.promotionName} onChange={handleChange} />
                      <ErrorMessage name="promotionName" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Description */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Description*</Form.Label>
                      <Form.Control as="textarea" rows={3} name="promotionDescription" value={values.promotionDescription} onChange={handleChange} />
                      <ErrorMessage name="promotionDescription" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Start & End Date */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Start Date*</Form.Label>
                      <Form.Control type="date" name="startDate" value={values.startDate as any} onChange={handleChange} />
                      <ErrorMessage name="startDate" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>End Date*</Form.Label>
                      <Form.Control type="date" name="endDate" value={values.endDate as any} onChange={handleChange} />
                      <ErrorMessage name="endDate" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Sail Date Dropdown */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Sail Date*</Form.Label>
                      <Form.Select name="sailDate" value={values.sailDate} onChange={handleChange}>
                        <option value="">--Select Sail Date--</option>
                        {sailDates.map((sd) => (
                          <option key={sd.id} value={sd.value}>
                            {dayjs(sd.value).format("YYYY-MM-DD")}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage name="sailDate" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>GroupId</Form.Label>
                      <Form.Select name="groupId" value={values.groupId} onChange={handleChange}>
                        <option value="">--Select Group Id--</option>
                        {groupId.map((sd) => (
                          <option key={sd.id} value={sd.name}>
                            {sd.name}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage name="groupId" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Destination Dropdown */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Destination*</Form.Label>
                      <Form.Select name="destinationId" value={values.destinationId} onChange={handleChange}>
                        <option value="">--Select Destination--</option>
                        {destinations.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage name="destinationId" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Cruise Line Dropdown */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Cruise Line*</Form.Label>
                      <Form.Select name="cruiseLineId" value={values.cruiseLineId} onChange={handleChange}>
                        <option value="">--Select Cruise Line--</option>
                        {cruiseLines.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                      <ErrorMessage name="cruiseLineId" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>

                  {/* Other fields (discounts, checkboxes, etc.) remain unchanged */}
                  {/* ... keep the rest of your fields as-is ... */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Discount %</Form.Label>
                      <Form.Control type="number" step="0.01" name="discountPer" value={values.discountPer} onChange={handleChange} readOnly/>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Discount Amount</Form.Label>
                      <Form.Control type="number" step="0.01" name="discountAmount" value={values?.discountAmount!} onChange={handleChange} readOnly/>
                    </Form.Group>
                  </Col>

                  {/* Promo Code */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Promo Code</Form.Label>
                      <Form.Control type="text" name="promoCode" value={values.promoCode} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  {/* Loyalty Level */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Loyalty Level</Form.Label>
                      <Form.Control type="text" name="loyaltyLevel" value={values.loyaltyLevel} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  {/* Checkboxes */}
                  <Col md={6}><Form.Check type="checkbox" label="First Time Customer" name="isFirstTimeCustomer" checked={values.isFirstTimeCustomer} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Adult Ticket Discount" name="isAdultTicketDiscount" checked={values.isAdultTicketDiscount} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Child Ticket Discount" name="isChildTicketDiscount" checked={values.isChildTicketDiscount} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Includes Airfare" name="includesAirfare" checked={values.includesAirfare} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Includes Hotel" name="includesHotel" checked={values.includesHotel} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Includes WiFi" name="includesWiFi" checked={values.includesWiFi} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Includes Shore Excursion" name="includesShoreExcursion" checked={values.includesShoreExcursion} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Stackable" name="isStackable" checked={values.isStackable} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Check type="checkbox" label="Active" name="isActive" checked={values.isActive} onChange={handleChange} /></Col>

                  {/* Numbers and text fields */}
                  <Col md={6}><Form.Group><Form.Label>Min Adults</Form.Label><Form.Control type="number" name="minNoOfAdultRequired" value={values.minNoOfAdultRequired as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Min Children</Form.Label><Form.Control type="number" name="minNoOfChildRequired" value={values.minNoOfChildRequired as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Min Passenger Age</Form.Label><Form.Control type="number" name="minPassengerAge" value={values.minPassengerAge as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Max Passenger Age</Form.Label><Form.Control type="number" name="maxPassengerAge" value={values.maxPassengerAge as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Passenger Type</Form.Label><Form.Control type="text" name="passengerType" value={values.passengerType} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Cabin Count Required</Form.Label><Form.Control type="number" name="cabinCountRequired" value={values.cabinCountRequired as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Sailing ID</Form.Label><Form.Control type="number" name="sailingId" value={values.sailingId as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Supplier ID</Form.Label><Form.Control type="number" name="supplierId" value={values.supplierId as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Affiliate Name</Form.Label><Form.Control type="text" name="affiliateName" value={values.affiliateName} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Onboard Credit Amount</Form.Label><Form.Control type="number" step="0.01" name="onboardCreditAmount" value={values.onboardCreditAmount as any} onChange={handleChange} /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Free Nth Passenger</Form.Label><Form.Control type="number" name="freeNthPassenger" value={values.freeNthPassenger as any} onChange={handleChange} /></Form.Group></Col>

                </Row>
              </Modal.Body>

              <Modal.Footer className="d-flex justify-content-end gap-2 px-4 py-3">
                <Button variant="outline-secondary" onClick={onHide}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </Modal.Footer>
            </FormikForm>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default EditPromotionModal;