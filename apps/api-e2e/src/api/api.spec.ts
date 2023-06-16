import axios from 'axios'

describe('GET /health', () => {
    it('should be healthy', async () => {
        const res = await axios.get(`/health`)

        expect(res.status).toBe(200)
        expect(res.data.healthy).toEqual(true)
    })
})
