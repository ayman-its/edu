const getServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const createService = async (req, res) => {
    try {
        const { name, description, categoryId } = req.body;
        const service = await prisma.service.create({
            data: { name, description, categoryId },
        });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, categoryId } = req.body;
        const service = await prisma.service.update({
            where: { id },
            data: { name, description, categoryId },
        });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.service.delete({ where: { id } });
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { getServices, getServiceById, createService, updateService, deleteService };
