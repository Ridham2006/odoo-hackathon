import { Driver } from '../models/models';

// GET ALL DRIVERS
export const getDrivers = async (c: any) => {
  try {
    const { status } = c.req.query();
    const query: any = {};
    if (status) query.status = status;

    const drivers = await Driver.find(query).sort({ createdAt: -1 });
    return c.json(drivers);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// GET SINGLE DRIVER
export const getDriverById = async (c: any) => {
  try {
    const driver = await Driver.findById(c.req.param('id'));
    if (!driver) return c.json({ error: 'Driver not found' }, 404);
    return c.json(driver);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// CREATE DRIVER
export const createDriver = async (c: any) => {
  try {
    const body = await c.req.json();
    
    // Check unique licenseNo
    const existing = await Driver.findOne({ licenseNo: body.licenseNo });
    if (existing) return c.json({ error: 'License Number must be unique' }, 400);

    const driver = new Driver(body);
    await driver.save();
    return c.json(driver, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// UPDATE DRIVER
export const updateDriver = async (c: any) => {
  try {
    const body = await c.req.json();
    const driverId = c.req.param('id');

    if(body.licenseNo) {
       const existing = await Driver.findOne({ licenseNo: body.licenseNo, _id: { $ne: driverId } });
       if (existing) return c.json({ error: 'License Number must be unique' }, 400);
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId, 
      { $set: body }, 
      { new: true, runValidators: true }
    );
    
    if (!driver) return c.json({ error: 'Driver not found' }, 404);
    return c.json(driver);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// DELETE DRIVER
export const deleteDriver = async (c: any) => {
  try {
    const driver = await Driver.findByIdAndDelete(c.req.param('id'));
    if (!driver) return c.json({ error: 'Driver not found' }, 404);
    return c.json({ message: 'Driver deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
