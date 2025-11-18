import requests
import unittest

BASE_URL = "https://httpbin.org"

class TestRequests(unittest.TestCase):
    def test_get_basic(self):
        resp = requests.get(f"{BASE_URL}/get")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("url", data)
        self.assertTrue(data["url"].startswith(BASE_URL + "/get"))

    def test_get_request(self):
        response = requests.get(f"{BASE_URL}/get", headers={"CUSTOM": "DATA"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("url", data)
        self.assertEqual(data["url"], "https://httpbin.org/get")
        self.assertIn("args", data)


if __name__ == '__main__':
    unittest.main()
